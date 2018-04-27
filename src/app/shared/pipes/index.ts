
import { NgModule } from '@angular/core';

import { AddCommasPipe } from './add-commas';
import { EllipsisPipe } from './ellipsis';
import { MinuteSecondsPipe} from './timer-pipe';

export const PIPES = [AddCommasPipe, EllipsisPipe, MinuteSecondsPipe];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class PipesModule {}
