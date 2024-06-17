import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const groups = [
    { id: 1, name: 'Всі групи', subjects: ['Оберіть групу'] },
    { id: 2, name: 'КН 20-1', subjects: ['Vite', 'React', 'Angular'] },
    { id: 3, name: 'КН 20-2', subjects: ['C#', 'Tailwind', 'React'] },
    // Добавьте остальные группы с их предметами
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ExamsPage() {
    const [selectedGroup, setSelectedGroup] = useState(groups[0])
    const [selectedSubject, setSelectedSubject] = useState(selectedGroup.subjects[0])
    const [link, setLink] = useState('')
    const [errors, setErrors] = useState({})

    const handleLinkChange = (event) => {
        setLink(event.target.value)
    }

    const handleSubmit = () => {
        let newErrors = {}

        if (selectedGroup.id === 1) {
            newErrors.group = true
        }

        if (selectedSubject === 'Оберіть групу') {
            newErrors.subject = true
        }

        if (link.trim() === '') {
            newErrors.link = true
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            setErrors({})
            alert('Помилка з зв\'язком підсистеми "Студент"');
            // Ваша логика для отправки ссылки
            console.log('Отправка ссылки:', link);
        }
    }

    return (
        <>
            <div className='p-10'>
                <p className="block text-2xl pt-1 mb-8 font-bold leading-6 text-gray-900">Відправка тестування</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Listbox value={selectedGroup} onChange={setSelectedGroup}>
                        {({ open }) => (
                            <>
                                <div>
                                    <Listbox.Label className="block text-md font-medium leading-6 text-gray-900">Оберіть групу</Listbox.Label>
                                    <div className="relative mt-2">
                                        <Listbox.Button className={`relative w-full cursor-default rounded-md py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm sm:leading-6 ${errors.group ? 'bg-red-100 border-red-500' : 'bg-white ring-gray-300 focus:ring-indigo-500'
                                            }`}>
                                            <span className="flex items-center">
                                                <span className="ml-3 block truncate">{selectedGroup.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {groups.map((group) => (
                                                    <Listbox.Option
                                                        key={group.id}
                                                        className={({ active }) =>
                                                            classNames(
                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                                            )
                                                        }
                                                        value={group}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <div className="flex items-center">
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                                                                        {group.name}
                                                                    </span>
                                                                </div>
                                                                {selected ? (
                                                                    <span className={classNames(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </div>
                            </>
                        )}
                    </Listbox>

                    <Listbox value={selectedSubject} onChange={setSelectedSubject}>
                        {({ open }) => (
                            <>
                                <div>
                                    <Listbox.Label className="block text-md font-medium leading-6 text-gray-900">Оберіть предмет</Listbox.Label>
                                    <div className="relative mt-2">
                                        <Listbox.Button className={`relative w-full cursor-default rounded-md py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm sm:leading-6 ${errors.subject ? 'bg-red-100 border-red-500' : 'bg-white ring-gray-300 focus:ring-indigo-500'
                                            }`}>
                                            <span className="flex items-center">
                                                <span className="ml-3 block truncate">{selectedSubject}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {selectedGroup.subjects.map((subject, index) => (
                                                    <Listbox.Option
                                                        key={index}
                                                        className={({ active }) =>
                                                            classNames(
                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                                            )
                                                        }
                                                        value={subject}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <div className="flex items-center">
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                                                                        {subject}
                                                                    </span>
                                                                </div>
                                                                {selected ? (
                                                                    <span className={classNames(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <div className="mt-4">
                    <label htmlFor="link" className="block text-md font-medium leading-6 text-gray-900">Введіть посилання</label>
                    <input
                        id="link"
                        type="text"
                        placeholder='Введіть посилання на тест'
                        className={`mt-1 pl-4 block w-full h-10 rounded-md bg-white border shadow-sm focus:ring-indigo-500 sm:text-sm ${errors.link ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                            }`}
                        value={link}
                        onChange={handleLinkChange}
                    />
                </div>
                <div className="mt-4">
                    <button onClick={handleSubmit} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md">Відправити</button>
                </div>
            </div>
        </>
    )
}
