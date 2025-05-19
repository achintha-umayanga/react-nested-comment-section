const TypingIndicator = () => {
  return (
    <div className="flex space-x-1">
      <div
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  )
}

export default TypingIndicator
