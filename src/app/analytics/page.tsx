import { ChartAreaInteractive } from '@/components/charts/chart-area-interactive';
import { ChartBarLabelCustom } from '@/components/charts/chart-bar-label-custom';
import { ChartPieDonutText } from '@/components/charts/chart-pie-donut-text';
import { ChartPieLabel } from '@/components/charts/chart-pie-label';

export default function AnalyticsPage() {
  return (
    <div className="flex w-full flex-col items-center gap-2 overflow-x-hidden px-2 pb-10">
      <div className="w-full">
        <ChartAreaInteractive />
      </div>
      <div className="w-full">
        <ChartBarLabelCustom />
      </div>
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="w-full">
          <ChartPieLabel />
        </div>

        <div className="w-full">
          <ChartPieDonutText />
        </div>
      </div>
    </div>
  );
}
