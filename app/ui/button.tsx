import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// export function Button({ children, className, ...rest }: ButtonProps) {
export function Button({ children }: ButtonProps) {
  return (
    
    // <button
    //   {...rest}
    //   className={clsx(
    //     'flex h-12 items-center rounded-lg bg-red-500 px-4 text-base font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    //     className,
    //   )}
    // >

    <button className='flex h-12 items-center rounded-lg bg-red-500 px-4 text-base font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50' >
      {children}
    </button>
  );
}
