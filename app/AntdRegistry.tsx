'use client';

import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createCache());

  useServerInsertedHTML(() => {
    const styleText = extractStyle(cache);
    return <style dangerouslySetInnerHTML={{ __html: styleText }} />;
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}