import { useState } from "react";

export default function UsernameForm({ onSubmit }) {
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username) onSubmit(username);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-white text-2xl text-center">Welcome</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="p-2 rounded-lg border-2 border-blue-500 text-white"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
                Continue
            </button>
        </form>
    );
}