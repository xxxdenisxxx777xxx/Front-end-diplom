
import TeachersTable from "../components/teachers/TeachersTable"

export default function TeachersPage() {
    return (
        <div className="p-10 ">
            <p className="font-bold text-2xl">Викладачі</p>
            <div className="flex items-center justify-between gap-5">
                <div className="w-full">
                    <TeachersTable />
                </div>
            </div>
        </div>
    )

}