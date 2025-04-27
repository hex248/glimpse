import ProfileForm from "@/components/ui/profile-form";

export default function EditProfilePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center border rounded-xl p-6 shadow-md bg-popover w-[95%] max-w-2xl gap-6">
                <h1 className="text-xl">Edit Your Profile</h1>
                <ProfileForm />
            </div>
        </div>
    );
}
