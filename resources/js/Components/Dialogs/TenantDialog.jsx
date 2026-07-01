import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import InputWithLabel from "../InputWithLabel";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export default function TenantDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    children,
}) {
    const process = method === "Create" ? "Creating..." : "Updating...";
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>
                            {method === "Create" ? "Add New " : "Update "}
                            Tenant
                        </DialogTitle>
                    </DialogHeader>
                    <div className="h-[270px] overflow-y-auto scroll">
                        <div className="grid gap-4 grid-cols-8 py-4 px-2">
                            <InputWithLabel
                                label="Name"
                                id="name"
                                value={form.name}
                                name="name"
                                onChange={handleChange}
                                error={errors.name}
                                placeholder="Juan P. Santo"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Email"
                                id="email"
                                value={form.email}
                                name="email"
                                type="email"
                                error={errors.email}
                                onChange={handleChange}
                                placeholder="juan@email.com"
                                className="col-span-4"
                            />
                            {method === "Create" && (
                                <>
                                    <InputWithLabel
                                        label="Password"
                                        id="password"
                                        value={form.password}
                                        name="password"
                                        type="password"
                                        error={errors.password}
                                        onChange={handleChange}
                                        placeholder=""
                                        className="col-span-4"
                                    />
                                    <InputWithLabel
                                        label="Confirm Password"
                                        id="password_confirmation"
                                        value={form.password_confirmation}
                                        name="password_confirmation"
                                        type="password"
                                        error={errors.password_confirmation}
                                        onChange={handleChange}
                                        placeholder=""
                                        className="col-span-4"
                                    />
                                </>
                            )}

                            <InputWithLabel
                                label="phone"
                                id="phone"
                                value={form.phone}
                                name="phone"
                                type="tel"
                                error={errors.phone}
                                onChange={handleChange}
                                placeholder="09123456789"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Address"
                                id="address"
                                value={form.address}
                                name="address"
                                type="text"
                                error={errors.address}
                                onChange={handleChange}
                                placeholder="136 Sampaloc Manila"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Emergency Contact"
                                id="emergency_contact"
                                value={form.emergency_contact}
                                name="emergency_contact"
                                type="text"
                                error={errors.emergency_contact}
                                onChange={handleChange}
                                placeholder="Peter S. Santos"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="ID Type"
                                id="id_type"
                                value={form.id_type}
                                name="id_type"
                                type="text"
                                error={errors.id_type}
                                onChange={handleChange}
                                placeholder="Driver's License"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="ID Number"
                                id="id_number"
                                value={form.id_number}
                                name="id_number"
                                type="text"
                                error={errors.id_number}
                                onChange={handleChange}
                                placeholder="D32156871"
                                className="col-span-4"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild onClick={() => setOpen(false)}>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? process : method}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
