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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { read } = await request.json()
    const messageId = params.id

    const messageIndex = messages.findIndex((msg) => msg.id === messageId)

    if (messageIndex === -1) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    messages[messageIndex] = {
      ...messages[messageIndex],
      read: read,
    }

    return NextResponse.json({
      success: true,
      message: messages[messageIndex],
    })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = params.id
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)

    if (messageIndex === -1) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    messages.splice(messageIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
