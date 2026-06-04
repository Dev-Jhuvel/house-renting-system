import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Share</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Share link</DialogTitle>
                                    <DialogDescription>
                                        Anyone who has this link will be able to
                                        view this.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center gap-2">
                                    <div className="grid flex-1 gap-2">
                                        <Label
                                            htmlFor="link"
                                            className="sr-only"
                                        >
                                            Link
                                        </Label>
                                        <Input
                                            id="link"
                                            defaultValue="https://ui.shadcn.com/docs/installation"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button type="button">Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
