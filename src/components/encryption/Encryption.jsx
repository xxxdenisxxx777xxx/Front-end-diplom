import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const Encryption = () => {
    const [base64Data, setBase64Data] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Convert workbook to binary string
                const binaryString = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

                // Convert binary string to base64
                const base64String = btoa(
                    binaryString.split('').map(char => String.fromCharCode(char.charCodeAt(0) & 0xff)).join('')
                );

                // Save the base64 string to state and localStorage
                setBase64Data(base64String);
                localStorage.setItem('base64Data', base64String);

                // Navigate to the download page
                navigate('/download');
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            <h1>Upload and Encode Excel File</h1>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </div>
    );
};

export default Encryption;
