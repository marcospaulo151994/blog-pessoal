import { MDXContent as BaseMDXContent } from '@content-collections/mdx/react';
import { mdxComponents } from './index';

export function MDXContent({ code }: { code: string }) {
  return <BaseMDXContent code={code} components={mdxComponents} />;
}
