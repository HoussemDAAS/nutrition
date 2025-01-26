import { cn } from '@/lib/utils';

interface props {
    children:React.ReactNode;
    className?:string;
}
const Container = ({children,className}:props) => {
  return (
    <div className={cn('max-w-screen-xl mx-auto px-4',className)}>
      {children}
    </div>
  )
}

export default Container
