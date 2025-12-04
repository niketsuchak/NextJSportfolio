import Link from '@/components/Link';
import SectionContainer from '@/components/SectionContainer';

export default function FourZeroFour() {
  return (
    <SectionContainer>
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Sorry we couldn&apos;t find this page.
        </p>
        <p className="mb-8">
          But don&apos;t worry, you can find plenty of other things on our homepage.
        </p>
        <Link href="/">Back to homepage</Link>
      </div>
    </SectionContainer>
  );
}
