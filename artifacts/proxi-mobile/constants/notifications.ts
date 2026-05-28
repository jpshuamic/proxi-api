export interface AppNotification {
  id: string;
  type: "message" | "offer" | "order" | "review" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  iconName: string;
  iconColor: string;
  iconBg: string;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "message",
    title: "New message from Chidi",
    body: "Is the price still negotiable on the iPhone 14?",
    time: "2m ago",
    read: false,
    iconName: "message-circle",
    iconColor: "#1D9E75",
    iconBg: "#E8F8F2",
  },
  {
    id: "n2",
    type: "offer",
    title: "Offer received",
    body: "Emeka Dike offered ₦320,000 for iPhone 14 Pro Max",
    time: "1h ago",
    read: false,
    iconName: "tag",
    iconColor: "#7F77DD",
    iconBg: "#EEEDFE",
  },
  {
    id: "n3",
    type: "order",
    title: "Payment in escrow",
    body: "Order #PRX-00124 confirmed. Payment held safely until delivery.",
    time: "3h ago",
    read: true,
    iconName: "shield",
    iconColor: "#1D9E75",
    iconBg: "#E8F8F2",
  },
  {
    id: "n4",
    type: "review",
    title: "New 5-star review!",
    body: "Emeka Dike gave you 5 stars: \"Excellent seller, fast delivery!\"",
    time: "Yesterday",
    read: true,
    iconName: "star",
    iconColor: "#EF9F27",
    iconBg: "#FEF8EC",
  },
  {
    id: "n5",
    type: "system",
    title: "Trust score improved",
    body: "Your trust score increased to 82. Complete your address to reach 90+.",
    time: "2 days ago",
    read: true,
    iconName: "trending-up",
    iconColor: "#185FA5",
    iconBg: "#E6F1FB",
  },
  {
    id: "n6",
    type: "message",
    title: "Ada Nwachukwu replied",
    body: "Yes, I can start the project this week!",
    time: "2 days ago",
    read: true,
    iconName: "message-circle",
    iconColor: "#1D9E75",
    iconBg: "#E8F8F2",
  },
  {
    id: "n7",
    type: "system",
    title: "Listing viewed 48 times",
    body: "Your Nike Air Max listing is getting attention — consider lowering the price.",
    time: "3 days ago",
    read: true,
    iconName: "eye",
    iconColor: "#D85A30",
    iconBg: "#FAECE7",
  },
];
