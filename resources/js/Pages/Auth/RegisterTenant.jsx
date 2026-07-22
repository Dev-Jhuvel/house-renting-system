import InputWithLabel from "@/Components/InputWithLabel";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";

export default function RegisterTenant({ user }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        phone: "",
        address: "",
        emergency_contact: "",
        id_type: "",
        id_number: "",
    });

    function handleChange(e) {
        const { name, type, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]:
                type === "number" && value !== ""
                    ? parseFloat(value) || 0
                    : value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route("register.tenant.store"), {
            onSuccess: () => {
                reset();
            },
        });
    }
    return (
        <div className="container mx-auto">
            <h1>Welcome {user.name}</h1>
            <h1>Before you can browse boarding houses, we need a few more details to complete your tenant profile.</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 px">
                    <InputWithLabel
                        label="Phone"
                        id="phone"
                        value={data.phone}
                        name="phone"
                        type="tel"
                        error={errors.phone}
                        onChange={handleChange}
                        placeholder="09123456789"
                        className="col-span-1"
                    />
                    <InputWithLabel
                        label="Address"
                        id="address"
                        value={data.address}
                        name="address"
                        type="text"
                        error={errors.address}
                        onChange={handleChange}
                        placeholder="136 Sampaloc Manila"
                        className="col-span-1"
                    />
                    <InputWithLabel
                        label="Emergency Contact"
                        id="emergency_contact"
                        value={data.emergency_contact}
                        name="emergency_contact"
                        type="text"
                        error={errors.emergency_contact}
                        onChange={handleChange}
                        placeholder="Peter S. Santos"
                        className="col-span-1"
                    />
                    <InputWithLabel
                        label="ID Type"
                        id="id_type"
                        value={data.id_type}
                        name="id_type"
                        type="text"
                        error={errors.id_type}
                        onChange={handleChange}
                        placeholder="Driver's License"
                        className="col-span-1"
                    />
                    <InputWithLabel
                        label="ID Number"
                        id="id_number"
                        value={data.id_number}
                        name="id_number"
                        type="text"
                        error={errors.id_number}
                        onChange={handleChange}
                        placeholder="D32156871"
                        className="col-span-1"
                    />
                </div>
                <Button className="ml-auto" type="submit" disabled={processing}>
                    {processing ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </div>
    );
}
