"use client"
import api from '@/lib/api'
import { DestinationData, TransportationData } from '@/types/types';
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Edit, Image as ImageIcon, X } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout';
import { toast } from 'react-toastify';

interface TransportationFormData {
    destinationId: string;
    price: string;
    name: string;
    capacity: string;
    grade: string;
    images: File[];
}


export default function TransportationPage() {
    const [destinations, setDestinations] = useState<DestinationData[]>([]);
    const [transportations, setTransportations] = useState<TransportationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [formData, setFormData] = useState<TransportationFormData>({
        destinationId: '',
        price: '',
        name: '',
        capacity: '',
        grade: '',
        images: []
    });

    useEffect(() => {
        fetchDestinations();
        fetchTransportationData();
    }, []);

    const fetchTransportationData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/transportations");
            setTransportations(response.data);
        } catch (error) {
            console.error('Failed to fetch transportations:', error);
            setError("Failed to load transportations. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const fetchDestinations = async () => {
        try {
            const response = await api.get("/destinations");
            setDestinations(response.data);
        } catch (error) {
            console.error('Failed to load destinations:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormData(prev => ({
                ...prev,
                images: Array.from(files)
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const resetForm = () => {
        setFormData({
            destinationId: '',
            price: '',
            name: '',
            capacity: '',
            grade: '',
            images: []
        });
        setFormError("");
        setFormSuccess("");
        const fileInput = document.getElementById('images') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const addTransportationData = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");
        setFormSuccess("");

        // Validation
        if (!formData.destinationId || !formData.price || !formData.name || !formData.capacity || !formData.grade) {
            setFormError("All fields are required");
            setFormLoading(false);
            return;
        }

        if (formData.images.length === 0) {
            setFormError("At least one image is required");
            setFormLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('destinationId', formData.destinationId);
            formDataToSend.append('price', formData.price);

            // Create vehiclesType as JSON string
            const vehiclesTypeData = {
                name: formData.name,
                capacity: parseInt(formData.capacity)
            };
            formDataToSend.append('vehiclesType', JSON.stringify(vehiclesTypeData));

            formDataToSend.append('grade', formData.grade);

            // Append all images
            formData.images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const response = await api.post("/admin/transportation/add", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormSuccess("Transportation added successfully!");
            resetForm();
            fetchTransportationData();

        } catch (error: any) {
            console.error('Failed to add transportation:', error);
            setFormError(error.response?.data?.error || "Failed to add transportation. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    const deleteTransportation = async (id: number) => {
        try {
            await api.delete(`/admin/transportation/delete/${id}`);
            toast.success('Transportation deleted successfully');
            fetchTransportationData();
        } catch (error) {
            toast.error('Failed to delete transportation. Please try again.');
        }
    };

    const getDestinationName = (destinationId: number) => {
        const destination = destinations.find(dest => dest.destination?.id === destinationId);
        return destination?.destination?.name || 'Unknown Destination';
    };

    // Since we don't have vehicle name and capacity in the response, we'll need to fetch them separately
    // or adjust the backend to include them in the response
    const getVehicleInfo = (transportation: TransportationData) => {
        // This would need to be implemented based on your actual data structure
        // For now, we'll return placeholder data
        return {
            name: `Vehicle ${transportation.transportation.vechileTypeId}`,
            capacity: 'Unknown'
        };
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Transportation Management</h1>
                            <p className="text-gray-600 mt-2">Manage transportation options for destinations</p>
                        </div>

                        {/* Add Transportation Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Transportation
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New Transportation</DialogTitle>
                                    <DialogDescription>
                                        Add a new transportation option for your destinations.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={addTransportationData} className="space-y-6">
                                    {/* Destination Dropdown */}
                                    <div className="space-y-2">
                                        <Label htmlFor="destinationId">Destination *</Label>
                                        <Select
                                            value={formData.destinationId}
                                            onValueChange={(value) => handleSelectChange('destinationId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a destination" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {destinations.map((destination) => (
                                                    <SelectItem
                                                        key={destination.destination.id}
                                                        value={destination.destination.id.toString()}
                                                    >
                                                        {destination.destination.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Vehicle Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Luxury Bus, Express Train"
                                                required
                                            />
                                        </div>

                                        {/* Capacity */}
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity">Capacity *</Label>
                                            <Input
                                                type="number"
                                                id="capacity"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleInputChange}
                                                placeholder="Number of passengers"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price *</Label>
                                            <Input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="Enter price"
                                                required
                                            />
                                        </div>

                                        {/* Grade */}
                                        <div className="space-y-2">
                                            <Label htmlFor="grade">Grade *</Label>
                                            <Input
                                                id="grade"
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Economy, Business, First Class"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="images">Images *</Label>
                                        <Input
                                            type="file"
                                            id="images"
                                            name="images"
                                            onChange={handleImageChange}
                                            multiple
                                            accept="image/*"
                                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Upload one or multiple images for the transportation
                                        </p>

                                        {/* Preview Images */}
                                        {formData.images.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Selected Images ({formData.images.length}):
                                                </p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {formData.images.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Form Error */}
                                    {formError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                            {formError}
                                        </div>
                                    )}

                                    {/* Form Success */}
                                    {formSuccess && (
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                            {formSuccess}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-3 pt-4">
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline" onClick={resetForm}>
                                                Cancel
                                            </Button>
                                        </DialogTrigger>
                                        <Button
                                            type="submit"
                                            disabled={formLoading}
                                            className="flex items-center gap-2"
                                        >
                                            {formLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4" />
                                                    Add Transportation
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Transportation List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transportation List</CardTitle>
                            <CardDescription>
                                All available transportation options across destinations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Loading transportations...</p>
                                </div>
                            ) : transportations.length === 0 ? (
                                <div className="text-center py-8">
                                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transportations found</h3>
                                    <p className="text-gray-600 mb-4">Get started by adding your first transportation option.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Destination</TableHead>
                                            <TableHead>Grade</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transportations.map((item) => {
                                            const vehicleInfo = getVehicleInfo(item);
                                            return (
                                                <TableRow key={item.transportation.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.image.url}
                                                                alt="Transportation"
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                            <div>
                                                                <div className="font-medium">{vehicleInfo.name}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    Capacity: {vehicleInfo.capacity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getDestinationName(item.transportation.destinationId)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {item.transportation.grade}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        ${item.transportation.price}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(item.transportation.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => deleteTransportation(item.transportation.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}
