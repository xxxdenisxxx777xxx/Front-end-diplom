import React, { useState, useEffect } from "react";
import axios from "axios";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
import ImageModule from "docxtemplater-image-module-free";

function base64ToArrayBuffer(base64) {
    if (!base64 || typeof base64 !== 'string') {
        throw new Error('Invalid base64 string');
    }

    base64 = base64.replace(/\s/g, '');

    const validBase64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!validBase64Regex.test(base64)) {
        throw new Error('Invalid base64 string');
    }

    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function EncryptionStudents({ studentId }) {
    const [student, setStudent] = useState("");
    const [dateBirthday, setDateBirthday] = useState("");
    const [citizenship, setCitizenship] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [undef, setUndef] = useState("Не виявлено");
    const [fo_id, setFo_id] = useState("");
    const [doc, setDoc] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://77.221.152.210:5008/api/Users/${studentId}`);
                const { item } = response.data;
                if (item) {
                    setStudent(item.student);
                    setDateBirthday(item.birth_date);
                    setCitizenship(item.citizenship);
                    setUndef("Не виявлено");
                    setFo_id(item.fo_id);
                    const photoBase64 = item.photoBase64.split(',')[0];

                    if (!photoBase64 || photoBase64 === "undefined") {
                        console.error("Invalid photoBase64 string");
                        return;
                    }
                    setPhotoBase64(photoBase64);
                }
            } catch (error) {
                console.error("Ошибка при получении данных о студенте:", error);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    useEffect(() => {
        JSZipUtils.getBinaryContent("/studentCard.docx", (err, content) => {
            if (err) {
                console.error("Ошибка при загрузке файла:", err);
                return;
            }
            try {
                const zip = new PizZip(content);
                const imageModule = new ImageModule({
                    centered: false,
                    getImage: function (tagValue) {
                        try {
                            return base64ToArrayBuffer(tagValue);
                        } catch (error) {
                            console.error("Error in getImage:", error);
                            throw error;
                        }
                    },
                    getSize: function (img, tagValue, tagName) {
                        return [100, 123];
                    },
                });
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    modules: [imageModule],
                });
                setDoc(doc);
            } catch (error) {
                console.error("Ошибка при инициализации Docxtemplater:", error);
                console.error(error.properties);
            }
        });
    }, []);

    const handleFileDownload = () => {
        if (doc) {
            try {
                console.log("Rendering document with data:", {
                    student,
                    date_birthday: dateBirthday,
                    photo: `data:image/jpeg;base64,${photoBase64}`,
                    citizenship,
                    undef,
                    fo_id
                });

                doc.setData({
                    student,
                    date_birthday: dateBirthday,
                    photo: `data:image/jpeg;base64,${photoBase64}`,
                    citizenship,
                    undef,
                    fo_id
                });

                doc.render();
            } catch (error) {
                console.error("Ошибка при рендеринге документа:", error);
                if (error.properties && error.properties.errors) {
                    error.properties.errors.forEach(e => {
                        console.error(e);
                    });
                }
                return;
            }

            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            saveAs(out, "modified_document.docx");
        }
    };

    return (
        <div>
            <button className="bg-sky-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={handleFileDownload}>Данні .docx</button>
        </div>
    );
}

export default EncryptionStudents;
