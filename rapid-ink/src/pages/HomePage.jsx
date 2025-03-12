import UsernameForm from "../components/UsernameForm";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const handleUsernameSubmit = async (username) => {
        try {
            const response = await fetch('http://localhost:8000/return_label', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            localStorage.setItem('vehicle_labels', JSON.stringify(data));
            setTimeout(() => {
                const simulatedImageName = "sample-image.jpg";
                navigate(`/${username}/${simulatedImageName}`);
            }, 1000);
        } catch (error) {
            console.error('Error fetching vehicle labels:', error);
            setTimeout(() => {
                const simulatedImageName = "sample-image.jpg";
                navigate(`/${username}/${simulatedImageName}`);
            }, 1000);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-black">
            <UsernameForm onSubmit={handleUsernameSubmit} />
        </div>
    );
}