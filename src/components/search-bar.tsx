"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserSearchItem from "@/components/user-search-item";

interface SearchUser {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    color: string | null;
}

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchUsers = useCallback(async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/users/search?q=${encodeURIComponent(query.trim())}`
            );

            if (!response.ok) {
                throw new Error("Failed to search users");
            }

            const users = await response.json();
            setResults(users);
        } catch (error) {
            console.error("Error searching users:", error);
            setError("Failed to search users. Please try again.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // debounce search with 300ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, searchUsers]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
            <div className="flex-1 w-full max-w-md mx-auto">
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        type="text"
                        placeholder="Search for users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="flex-2 w-full max-w-md mx-auto flex flex-col">
                {loading && searchTerm.trim() && (
                    <div className="text-center py-4 text-muted-foreground">
                        Searching...
                    </div>
                )}

                {error && (
                    <div className="text-center py-4 text-red-500">{error}</div>
                )}

                {!loading &&
                    !error &&
                    searchTerm.trim() &&
                    results.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                            No users found for "{searchTerm}"
                        </div>
                    )}

                {results.length > 0 && (
                    <div className="space-y-1">
                        {results.map((user) => (
                            <UserSearchItem key={user.id} user={user} />
                        ))}
                    </div>
                )}

                {!searchTerm.trim() && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <Search size={48} className="mx-auto opacity-50" />
                            <p>Start typing to search for users</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
