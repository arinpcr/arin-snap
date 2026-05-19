import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Alert from "../components/Alert";

export default function Components() {
    return (
        <div className="p-2 pb-20 font-poppins">
            <PageHeader title="UI Components" breadcrumb="Playground" />
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
                <Card>
                    <h3 className="font-bold mb-4">Basic Elements</h3>
                    <div className="flex gap-2 mb-4">
                        <Avatar name="Arini" />
                        <Badge type="success">Active</Badge>
                    </div>
                    <Button type="primary">Call Action</Button>
                </Card>

                <Card>
                    <h3 className="font-bold mb-4">Feedback & Forms</h3>
                    <Alert type="success">Data saved successfully!</Alert>
                    <div className="mt-4">
                        <InputField label="Guest Name" placeholder="John Doe" />
                    </div>
                </Card>
            </div>
        </div>
    );
}