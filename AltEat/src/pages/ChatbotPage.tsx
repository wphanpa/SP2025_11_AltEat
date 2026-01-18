import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import ChatFeedback from "../component/ChatFeedback"
import type { User } from "@supabase/supabase-js"
import Navbar from "../component/Navbar"
import { MoreVertical, Edit2, Trash2, X, Check } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "bot"
  text: string
}

interface ChatSession {
  session_id: string
  title: string
  created_at: string
}

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/f5e289b6-4914-4c86-ade9-b5a99970a807/chat"

function ChatbotPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

  const toggleMenu = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    setMenuOpenId(menuOpenId === sessionId ? null : sessionId) 
  }

  const handleRenameClick = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation()
    setEditingSessionId(session.session_id)
    setEditTitle(session.title)
    setMenuOpenId(null)
  }

  const handleRenameSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (!editingSessionId || !editTitle.trim()) return

    const { error } = await supabase
      .from("chat_sessions")
      .update({ title: editTitle.trim() })
      .eq("session_id", editingSessionId)

    if (!error) {
      setSessions(sessions.map((s) => s.session_id === editingSessionId ? { ...s, title: editTitle.trim() } : s))
      setEditingSessionId(null)
      setEditTitle("")
    }
  }

  const handleDeleteClick = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    setDeleteConfirmationId(sessionId)
    setMenuOpenId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmationId) return

    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("session_id", deleteConfirmationId)

    if (!error) {
      setSessions(sessions.filter((s) => s.session_id !== deleteConfirmationId))
      if(currentSessionId === deleteConfirmationId) {
        handleNewChat()
      }
      setDeleteConfirmationId(null)
    }
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const handleOutsideClick = () => setMenuOpenId(null)
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])


  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setAuthLoading(false)
      } else {
        navigate("/login")
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setAuthLoading(false)
      } else {
        navigate("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  // Load sessions when user is authenticated
  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  const loadSessions = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setSessions(data)
    }
  }

  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (!error && data) {
      setMessages(
        data.map((msg) => ({
          id: msg.message_id,
          role: msg.sender_type as "user" | "bot",
          text: msg.message_text,
        })),
      )
    }
  }

  const createNewSession = async (firstMessage: string) => {
    if (!user) return null
    
    const sessionId = generateId()
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage

    const { error } = await supabase.from("chat_sessions").insert({
      session_id: sessionId,
      user_id: user.id,
      title: title,
    })

    if (!error) {
      setCurrentSessionId(sessionId)
      await loadSessions()
      return sessionId
    }
    return null
  }

  const saveMessage = async (sessionId: string, messageId: string, senderType: "user" | "bot", messageText: string) => {
    await supabase.from("chat_messages").insert({
      message_id: messageId,
      session_id: sessionId,
      sender_type: senderType,
      message_text: messageText,
    })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return

    const userMessage = input.trim()
    const userMessageId = generateId()
    setInput("")
    setIsLoading(true)

    // Create new session if none exists
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = await createNewSession(userMessage)
      if (!sessionId) {
        setIsLoading(false)
        return
      }
    }

    // Add user message to UI
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      text: userMessage,
    }
    setMessages((prev) => [...prev, userMsg])

    // Save user message to Supabase
    await saveMessage(sessionId, userMessageId, "user", userMessage)

    try {
      // Send to n8n webhook
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput: userMessage,
          sessionId: sessionId,
          messageId: userMessageId,
          userId: user.id,
        }),
      })

      const data = await res.json()

      // Parse bot response
      let botResponse = ""
      if (data.output) {
        botResponse = data.output
      } else if (data.text) {
        botResponse = data.text
      } else if (typeof data === "string") {
        botResponse = data
      } else {
        botResponse = JSON.stringify(data, null, 2)
      }

      const botMessageId = generateId()
      const botMsg: ChatMessage = {
        id: botMessageId,
        role: "bot",
        text: botResponse,
      }
      setMessages((prev) => [...prev, botMsg])

      // Save bot message to Supabase
      await saveMessage(sessionId, botMessageId, "bot", botResponse)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessageId = generateId()
      const errorMsg: ChatMessage = {
        id: errorMessageId,
        role: "bot",
        text: "Sorry, there was an error processing your request. Please try again.",
      }
      setMessages((prev) => [...prev, errorMsg])
      await saveMessage(sessionId, errorMessageId, "bot", errorMsg.text)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleNewChat = () => {
    setCurrentSessionId(null)
    setMessages([])
  }

  const handleSessionClick = async (sessionId: string) => {
    setCurrentSessionId(sessionId)
    await loadMessages(sessionId)
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FFCB69] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/chatbot-bg.png')",
      }}
    >
        <Navbar/>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r transition-all duration-300 flex flex-col ${isSidebarOpen ? "w-64" : "w-14"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3">
            {isSidebarOpen && <span className="text-sm font-semibold">History</span>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#FFCB69] transition"
            >
              {isSidebarOpen ? "⟨" : "⟩"}
            </button>
          </div>

          {isSidebarOpen && (
            <div className="px-3 pb-2">
              <button
                onClick={handleNewChat}
                className="w-full py-2 px-3 bg-[#FFCB69] rounded-md text-sm font-medium hover:bg-[#e6b85e] transition"
              >
                 New Chat
              </button>
            </div>
          )}

          <div className="border-t border-gray-300"></div>

          {isSidebarOpen && (
            <ul className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm text-gray-600">
              {sessions.map((session) => (
                <li
                  key={session.session_id}
                  onClick={() => editingSessionId !== session.session_id &&handleSessionClick(session.session_id)}
                  className={`rounded-md px-2 py-1.5 cursor-pointer transition-colors duration-200 relative ${
                    currentSessionId === session.session_id ? "bg-[#FFCB69]" : "hover:bg-[#FFCB69]/50"
                  }`}
                >
                  {editingSessionId === session.session_id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 min-w-0 bg-white border border-gray-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-[#FFCB69]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameSubmit()
                          if (e.key === "Escape") setEditingSessionId(null)
                        }}
                      />
                      <button onClick={() => handleRenameSubmit()} className="text-green-600 hover:text-green-700">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingSessionId(null)} className="text-red-500 hover:text-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="truncate flex-1">{session.title}</span>
                      <div className="relative">
                        <button
                          onClick={(e) => toggleMenu(e, session.session_id)}
                          className={`p-1 rounded-full hover:bg-black/10 transition-opacity`}
                        >
                          <MoreVertical size={14} />
                        </button>
                        {menuOpenId === session.session_id && (
                          <div className="absolute right-0 top-6 z-20 w-32 bg-white rounded-md shadow-lg border border-gray-100 py-1 overflow-hidden">
                            <button
                              onClick={(e) => handleRenameClick(e, session)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <Edit2 size={12} /> Rename
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, session.session_id)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                 </li>
              ))}
              {sessions.length === 0 && <li className="text-gray-400 text-center py-4">No chat history yet</li>}
            </ul>
          )}
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl h-full max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col p-6">
            {/* Welcome Card - show only when no messages */}
            {messages.length === 0 && (
              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <h1 className="font-semibold text-lg mb-1">Hi there! Looking for a food substitute?</h1>
                <p className="text-sm text-gray-600 mb-4">
                  Just tell me what ingredient you have or don't have, and I'll suggest tasty alternatives.
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Substitute for milk",
                    "What can replace soy sauce?",
                    "Replace egg in baking",
                    "What can I use instead of sugar?",
                  ].map((text, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(text)}
                      className="px-3 py-1.5 bg-yellow-200 text-sm rounded-full hover:bg-[#FFCB69] transition"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "bot" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#FFCB69] rounded-full flex items-center justify-center text-sm">
                        B
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] ${
                      msg.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        msg.role === "user" ? "bg-[#FFCB69] rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {msg.role === "bot" && currentSessionId && (
                      <ChatFeedback messageId={msg.id} sessionId={currentSessionId} />
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        U
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#FFCB69] rounded-full flex items-center justify-center text-sm">B</div>
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-4">
              <div className="flex items-center border rounded-full px-4 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="How can I help you?"
                  className="flex-1 outline-none text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="ml-2 w-8 h-8 bg-[#FFCB69] rounded-full flex items-center justify-center hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
            <h3 className="text-lg font-semibold mb-2">Delete Chat Session?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this chat session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}       
    </div>
  )
}

export default ChatbotPage
