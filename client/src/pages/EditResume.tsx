import { useEffect } from 'react';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { useResumeStore } from '@/lib/resumeStore';

export default function EditResume() {
  const { initialize, initialized } = useResumeStore();

  // Initialize with default resume if not already initialized
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return <ResumeBuilder />;
}
