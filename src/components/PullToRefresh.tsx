import { type ReactNode, useRef, useState } from "react";

const THRESHOLD = 60;

interface PullToRefreshProps {
	onRefresh: () => void;
	children: ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
	const startY = useRef(0);
	const [pullDist, setPullDist] = useState(0);
	const [refreshing, setRefreshing] = useState(false);

	function handleTouchStart(e: React.TouchEvent) {
		if (window.scrollY === 0) {
			startY.current = e.touches[0].clientY;
		}
	}

	function handleTouchMove(e: React.TouchEvent) {
		if (startY.current === 0) return;
		const delta = e.touches[0].clientY - startY.current;
		if (delta > 0 && window.scrollY === 0) {
			setPullDist(Math.min(delta, THRESHOLD + 20));
		}
	}

	function handleTouchEnd() {
		if (pullDist >= THRESHOLD && !refreshing) {
			setRefreshing(true);
			window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
			onRefresh();
			setTimeout(() => {
				setRefreshing(false);
			}, 1200);
		}
		startY.current = 0;
		setPullDist(0);
	}

	const showIndicator = pullDist > 10 || refreshing;

	return (
		<div
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{/* Pull indicator */}
			<div
				className="flex justify-center items-center overflow-hidden transition-all duration-200"
				style={{
					height: showIndicator ? (refreshing ? 40 : pullDist * 0.6) : 0,
				}}
			>
				<svg
					className={`w-5 h-5 text-tg-hint ${refreshing ? "animate-spin" : ""}`}
					style={
						!refreshing
							? { transform: `rotate(${(pullDist / THRESHOLD) * 180}deg)` }
							: undefined
					}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					aria-hidden="true"
				>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
				</svg>
			</div>
			{children}
		</div>
	);
}
