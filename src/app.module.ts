import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassifyModule } from './classify/classify.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    ClassifyModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
