import { SumArrayPipe } from './sumArray.pipe';
import { SortPipe } from './sort.pipe';
import { ThaiDatePipe } from './thaiDate.pipe';
import { ThaiTimePipe } from './thaiTime.pipe';
import { SortFormArrayPipe } from './sortFormArray.pipe';
import { IsMatchesPipe } from './isMatches.pipe';

export const REWARD_PIPES = [
  SumArrayPipe,
  SortPipe,
  SortFormArrayPipe,
  ThaiDatePipe,
  ThaiTimePipe,
  IsMatchesPipe
];
