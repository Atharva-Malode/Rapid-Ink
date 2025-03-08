import UsernameForm from "../components/UsernameForm";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const handleUsernameSubmit = (username) => {
        // Simulate backend response
        setTimeout(() => {
            const simulatedImageName = "sample-image.jpg";
            navigate(`/${username}/${simulatedImageName}`);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-black">
            <UsernameForm onSubmit={handleUsernameSubmit} />
        </div>
    );
}