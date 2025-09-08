import { type NextRequest, NextResponse } from "next/server"

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  read: boolean
}

const messages: ContactMessage[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    messages.unshift(newMessage)

    console.log("New message received:", {
      from: newMessage.name,
      email: newMessage.email,
      time: new Date(newMessage.timestamp).toLocaleString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        id: newMessage.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sortedMessages = messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      messages: sortedMessages,
      total: messages.length,
      unread: messages.filter((m) => !m.read).length,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
