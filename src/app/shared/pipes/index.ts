
import { NgModule } from '@angular/core';
import { ObjNgForPipe} from './obj-ng-for.pipe';
import { AddCommasPipe } from './add-commas';
import { EllipsisPipe } from './ellipsis';
import { MinuteSecondsPipe} from './timer-pipe';


export const PIPES = [AddCommasPipe, EllipsisPipe, MinuteSecondsPipe, ObjNgForPipe];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class PipesModule {}
