"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccomodationData } from "@/types/types";
import { AdminLayout } from "@/components/admin/admin-layout";
import { toast } from "react-toastify";



interface Destination {
    id: number;
    name: string;
}

export default function AccomodationsPage() {
    const [accomodations, setAccomodations] = useState<AccomodationData[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        destinationId: "",
        price: "",
        files: [] as File[],
    });

    useEffect(() => {
        fetchAccomodations();
        fetchDestinations();
    }, []);

    const fetchAccomodations = async () => {
        setLoading(true);
        try {
            const response = await api.get("/accomodations");
            setAccomodations(response.data || []);
        } catch (error) {
            console.error("Failed to load accommodations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDestinations = async () => {
        try {
            const response = await api.get("/destinations");
            if (Array.isArray(response.data)) {
                const dests = response.data.map((d: any) => ({
                    id: d.destination.id,
                    name: d.destination.name,
                }));
                setDestinations(dests);
            }
        } catch (error) {
            console.error("Failed to load destinations", error);
        }
    };
    const checkDestinationsNameByID = (id: number) => {
        const destination = destinations.find((d) => d.id === id);
        return destination ? destination.name : "Unknown Destination";
    }
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("destinationId", formData.destinationId);
        data.append("price", formData.price);
        formData.files.forEach((file) => data.append("images", file));

        try {
            await api.post("/admin/accomodation/add", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setOpen(false);
            setFormData({
                name: "",
                description: "",
                destinationId: "",
                price: "",
                files: [],
            });
            fetchAccomodations();
        } catch (error) {
            console.error("Failed to add accommodation", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({ ...formData, files: Array.from(e.target.files) });
        }
    };
    const deleteAccomodation = async (id: number) => {
        try {
            const response = await api.delete(`/admin/accomodation/delete/${id}`);
            toast.success("Accommodation deleted successfully!");
            fetchAccomodations();
        } catch (err: any) {
            toast.error(err.message || "An error occurred while deleting the accommodation.");
        }
    };
    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Accommodations</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Accommodation
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Accommodation</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleAdd} className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label>Destination</Label>
                                <Select
                                    value={formData.destinationId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, destinationId: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {destinations.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="images">Images</Label>
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Add Accommodation
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Accommodation List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin h-8 w-8" />
                </div>
            ) : accomodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accomodations.map((acc) => (
                        <Card key={acc.accomodation.id} className="overflow-hidden">
                            {acc.image ? (
                                <img
                                    src={acc.image.url}
                                    alt={acc.accomodation.name}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle>{acc.accomodation.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {acc.accomodation.description}
                                </p>
                                <p className="mt-2 font-semibold text-primary">
                                    ${acc.accomodation.price}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Destination: {checkDestinationsNameByID(acc.accomodation.destinationId) || "N/A"}
                                </p>
                                <div className="delete">
                                    <Button onClick={() => deleteAccomodation(acc.accomodation.id)} variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-20">
                    No accommodations found.
                </div>
            )}

        </AdminLayout>
    );
}
