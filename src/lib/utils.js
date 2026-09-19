export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const days = Math.floor(seconds / 86400);
  if (days > 0) return days === 1 ? "1 day ago" : days + " days ago";

  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return hours === 1 ? "1 hour ago" : hours + " hours ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";

  return "just now";
}

export function scoreColor(score) {
  if (score >= 80) return "bg-green-50 text-green-700 border-green-200";
  if (score >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-red-50 text-red-700 border-red-200";
}
