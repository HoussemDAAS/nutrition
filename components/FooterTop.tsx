import { Clock,  Mail, MapPin, Phone } from 'lucide-react';
import React from 'react'
interface Props {
    title: string;
    subtitle: string;
    subtitle2?: string;
    icon:React.ReactNode;
}
const data: Props[] = [
    {
        title: 'Visitez notre magasin',
        subtitle: 'Rue ibn khaldoun derrière dar lihlib 7000 bizerte',
        icon: (<MapPin className='text-gray-600 group-hover:text-darkColor transition-colors' />)
    },
    {
        title: 'Appelez-nous',
        subtitle: '+216 50999210',
        icon: (<Phone className='text-gray-600 group-hover:text-darkColor transition-colors' />)
    },
    {
        title: 'Horaires d\'ouverture',
        subtitle: '9:00-19:00 : Lun-Sam',
        subtitle2: '9:00-15:00 : Dim',
        icon: (<Clock className='text-gray-600 group-hover:text-darkColor transition-colors' />)
    },
    {
        title: 'Envoyez-nous un email',
        subtitle: 'Akram_comptefb2@yahoo.fr',
        icon: (<Mail className='text-gray-600 group-hover:text-darkColor transition-colors' />)
    },
    
];

const FooterTop = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-2 border-b'>
      {data.map((item, index) => (
        <ContactItem key={index} icon={item?.icon} title={item?.title} subtitle={item?.subtitle} subtitle2={item?.subtitle2} />))}
    </div>
  )
}
const ContactItem = ({ title, subtitle, icon, subtitle2 }: Props) => {
  return <div className='flex items-center gap-4 group hover:bg-gray-50 p-4 transition-colors'>
{icon}
<div className=''>
    <h3 className='font-medium text-gray-900 group-hover:text-darkColor transition-colors'>{title}</h3>
    <p className='text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors'>{subtitle}</p>
    <p className='text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors'>{subtitle2}</p>
</div>
  </div>;
}
export default FooterTop
