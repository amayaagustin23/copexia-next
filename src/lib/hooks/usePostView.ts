import { postsService } from '@/services/postsService';
import { useEffect, useRef, useState } from 'react';

export function usePostView(postId: string, initialViewCount: number = 0) {
    const [viewCount, setViewCount] = useState(initialViewCount);
    const processedPostId = useRef<string | null>(null);

    useEffect(() => {
        if (!postId) return;

        if (processedPostId.current === postId) return;

        const storageKey = `viewed_post_${postId}`;
        const hasViewedInSession = sessionStorage.getItem(storageKey);

        if (!hasViewedInSession) {
            processedPostId.current = postId;

            const registerView = async () => {
                try {
                    const response: any = await postsService.incrementView(postId);
                    if (response && typeof response.viewCount === 'number') {
                        setViewCount(response.viewCount);
                        sessionStorage.setItem(storageKey, 'true');
                    }
                } catch (error) {
                    console.error('Error tracking view:', error);
                }
            };

            registerView();
        } else {
            processedPostId.current = postId;
        }
    }, [postId]);

    return { viewCount };
}
