export default function HomePage() {
    return (
        <section className="relative isolate overflow-hidden bg-white mt-16  ">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-2xl items-center justify-center lg:max-w-4xl">
                <div></div>
                <img className="mx-auto h-[100px]" src="https://raw.githubusercontent.com/xxxdenisxxx777xxx/eDniproPrct/main/ITSTEPLOGO.png" alt="" />
                <figure className="mt-10">
                    <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                        <p>
                            Доброго дня,  Іванно Володимирівна
                        </p>
                    </blockquote>
                    <figcaption className="mt-10">
                        <img
                            className="mx-auto h-[250px] rounded-full"
                            src="https://github.com/xxxdenisxxx777xxx/eDniproPrct/blob/main/IMG_0796.jpeg?raw=true"
                            alt=""
                        />
                        <div className="mt-9 flex items-center justify-center space-x-3 text-base">
                            <div className="font-semibold text-gray-900">Навчальна частина</div>
                            <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                                <circle cx={1} cy={1} r={1} />
                            </svg>
                            <div className="text-gray-600">Завуч</div>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </section>
    )
}
