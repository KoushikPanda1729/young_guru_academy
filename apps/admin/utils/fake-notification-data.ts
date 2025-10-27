export type Notification = {
  id: string
  title: string
  description: string
  time: Date
  status: "sent" | "scheduled"
  to: string
}

const titles = [
  "Course Launch Notification",
  "Live Session Reminder",
  "Weekly Newsletter",
  "Assignment Deadline",
  "System Maintenance",
  "Exam Date Announcement",
  "New Blog Post",
  "Webinar Invite",
  "Survey Request",
  "Feedback Reminder",
]

const descriptions = [
  "Announcing our new course on React.",
  "Don't miss the live Q&A session today.",
  "Check out what's new this week.",
  "Reminder: Your assignment is due tomorrow.",
  "System maintenance scheduled for this weekend.",
  "Upcoming exam details inside.",
  "We’ve published a new blog you’ll love.",
  "You're invited to our exclusive webinar.",
  "Please take 2 minutes to complete our survey.",
  "Help us improve by giving your feedback.",
]

const recipients = ["All Users", "Students", "Subscribers", "Admins", "Faculty"]

export function generateFakeNotifications(count: number): Notification[] {
  const notifications: Notification[] = []

  for (let i = 0; i < count; i++) {
    const status = i % 2 === 0 ? "sent" : "scheduled"
    const title = titles[i % titles.length] ?? "Untitled"
    const description = descriptions[i % descriptions.length] ?? "No description"
    const to = recipients[i % recipients.length] ?? "All Users"
    const daysAgo = i * 2
    const time = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    notifications.push({
      id: `${i + 1}`,
      title,
      description,
      time,
      status,
      to,
    })
  }

  return notifications
}

