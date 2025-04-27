import AuthStatus from "@/components/AuthStatus";

export default function Header() {
    return (
        <div className="w-full h-[50px] flex items-center justify-between p-2">
            <h1 className="text-3xl font-900">glimpse</h1>
            <AuthStatus />
        </div>
    );
}
