export default function LoadingStory() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center space-y-4 text-gray-600 animate-pulse">
            <div className="w-3/4 h-8 bg-gray-300 rounded-md"></div>
            <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
            <div className="w-full h-4 bg-gray-300 rounded-md"></div>
            <div className="w-full h-4 bg-gray-300 rounded-md"></div>
            <div className="w-5/6 h-4 bg-gray-300 rounded-md"></div>
            <p className="mt-6 text-base font-medium">Loading story details...</p>
        </div>
    )
}
