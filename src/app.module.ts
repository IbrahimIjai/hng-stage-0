import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassifyModule } from './classify/classify.module';

@Module({
  imports: [ClassifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
