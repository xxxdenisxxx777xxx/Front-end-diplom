import { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

export default function DropDisciplines({ onChange }) {
    const [disciplines, setDisciplines] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        axios.get('http://77.221.152.210:5008/api/Disciplines')
            .then(response => {
                setDisciplines(response.data.items);
                setSelected(response.data.items[1]);
            })
            .catch(error => {
                console.error('Error fetching disciplines:', error);
            });
    }, []);

    useEffect(() => {
        if (onChange && selected) {
            onChange(selected);
        }
    }, [selected, onChange]);

    return (
        <Listbox value={selected} onChange={(selected) => { setSelected(selected); }}>
            {({ open }) => (
                <>
                    <div className='w-full'>
                        <Listbox.Label className="block border-none w-full text-md font-medium leading-6 text-gray-900">Оберіть предмет</Listbox.Label>
                        <div className="relative mt-2">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                <span className="flex items-center">
                                    <span className="ml-3 block truncate">{selected ? selected.name : "Loading..."}</span>
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
                                    {disciplines && disciplines.map((discipline) => (
                                        <Listbox.Option
                                            key={discipline.id}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={discipline}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <span
                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                        >
                                                            {discipline.name}
                                                        </span>
                                                    </div>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                                active ? 'text-white' : 'text-indigo-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
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
    );
}
