import CardStatements from "../components/statements/CardStatements";
import DropGroups from "../components/students/dropdownGroups/DropGroups";

export default function StatementsPage() {
    return (
        <>
            <div className="p-10">
                <div className="mb-10">
                    <DropGroups />
                </div>
                <CardStatements />
            </div>
        </>
    )
}