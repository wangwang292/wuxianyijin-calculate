import Link from 'next/link';
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
}

export default function Card({ title, description, href, icon }: CardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-100 transition-colors">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
