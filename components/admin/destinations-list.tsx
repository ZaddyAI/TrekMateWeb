"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import api from "@/lib/api";
import { DestinationData } from "@/types/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

export function DestinationsList() {
    const [destinations, setDestinations] = useState<DestinationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        highestElivation: "",
        region: "",
    });

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/destinations");
            setDestinations(response.data);
        } catch (error) {
            setError("Failed to load destinations. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const addDestination = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("shortDescription", formData.shortDescription);
            data.append("highestElivation", formData.highestElivation);
            data.append("region", formData.region);

            if (files) {
                Array.from(files).slice(0, 5).forEach((file) => {
                    data.append("images", file);
                });
            }

            const response = await api.post("/admin/destination/add", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed to add destination");
            }

            toast.success("Destination added successfully!");
            setFormData({
                name: "",
                description: "",
                shortDescription: "",
                highestElivation: "",
                region: "",
            });
            setFiles(null);
            fetchDestinations();
        } catch (err: any) {
            setFormError(err.message || "An unexpected error occurred");
            toast.error("Failed to add destination.");
        } finally {
            setFormLoading(false);
        }
    };
    const deleteDestination = async (id: number) => {
        try {
            const response = await api.delete(`/admin/destination/destination/${id}`);
            toast.success("Destination deleted successfully!");
            fetchDestinations();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete destination.");
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    Destinations ({destinations.length})
                </h2>

                {/* ShadCN UI Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Destination</Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Destination</DialogTitle>
                        </DialogHeader>

                        {formError && (
                            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                                {formError}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={addDestination}>
                            <div>
                                <Label htmlFor="name">Destination Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Annapurna Base Camp"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Input
                                    id="shortDescription"
                                    placeholder="A scenic Himalayan trek"
                                    value={formData.shortDescription}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shortDescription: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="region">Region</Label>
                                <Input
                                    id="region"
                                    placeholder="e.g., Gandaki"
                                    value={formData.region}
                                    onChange={(e) =>
                                        setFormData({ ...formData, region: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="highestElivation">
                                    Highest Elevation (m)
                                </Label>
                                <Input
                                    id="highestElivation"
                                    type="number"
                                    placeholder="e.g., 4130"
                                    value={formData.highestElivation}
                                    onChange={(e) =>
                                        setFormData({ ...formData, highestElivation: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    placeholder="Describe the destination..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="images">Images (up to 5)</Label>
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setFiles(e.target.files)}
                                    className="cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={formLoading}>
                                    {formLoading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Destination"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <p>Loading destinations...</p>
            ) : destinations.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                    No destinations yet. Add one to get started!
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {destinations.map((destination) => (
                        <Card key={destination.destination.id} className="overflow-hidden">
                            {destination.image && (
                                <img
                                    src={destination.image.url || "/placeholder.svg"}
                                    alt={destination.destination.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg">
                                    {destination.destination.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {destination.destination.region}
                                </p>
                                <p className="text-sm mb-4 line-clamp-2">
                                    {destination.destination.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">
                                        {destination.destination.region}
                                    </span>
                                    <Button onClick={() => deleteDestination(destination.destination.id)} variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
