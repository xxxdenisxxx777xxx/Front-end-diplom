import DropGroups from "../components/students/dropdownGroups/DropGroups"
import { useState } from "react";
import StudentsTable from "../components/students/StudentsTable"

export default function StudentPage() {
    const [selectedGroup, setSelectedGroup] = useState("Всі групи");

    return (
        <>
            <div className="p-10 ">
                <p className="font-bold text-2xl">Студенти</p>
                <div className="flex items-center pt-2 justify-between gap-5">
                    <div className="w-full">
                        <StudentsTable selectedGroup={selectedGroup} />
                    </div>
                </div>
            </div>
        </>
    )
}