export const STATUS_MAPPER = {
    "pending": "Pending",
    "refused": "Refused",
    "accepted": "Accepted"
}

export const STATUS_COLOR_MAPPER = {
    "refused": "rgba(253,92,99,0.63)",
    "accepted": "#D0FFBC"
}

export const STATUS_COLOR_MAPPER_OLD = {
    "refused": "rgba(253,92,99,0.30)",
    "accepted": "#d6f8c8"
}


export const mockedData = [
    {id: 1, date: "2025-03-07", hours: ["06:00", "07:00", "08:00"], name: "Ralfi", total: 10, status: "pending"},
    {id: 2, date: "2025-03-07", hours: ["09:00", "10:00", "11:00"], name: "Toni", total: 15, status: "pending"},
    {id: 3, date: "2025-03-07", hours: ["12:00", "13:00", "14:00"], name: "Blerta", total: 20, status: "accepted"},
    {id: 4, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Stela", total: 25, status: "pending"},
    {id: 5, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Ana", total: 50, status: "refused"},
    {id: 6, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Sara", total: 70, status: "refused"},
    {id: 7, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Elisa", total: 20, status: "pending"},
    {id: 8, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Geri", total: 30, status: "pending"},
    {id: 9, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Beni", total: 25, status: "pending"},
    {id: 10, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Liku", total: 25, status: "accepted"},
    {id: 11, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Qazo", total: 25, status: "accepted"},
    {id: 12, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Gezim", total: 25, status: "refused"},
]