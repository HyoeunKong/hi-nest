## NestJS 시작하기

1. test tool 설치하기 Insomnia (Postman 이랑 비슷함)

2. npm i -g @nestjs/cli 
npm 사용 권장!

3. 프로젝트 생성하기
  ```bash
  nest new
  ```

### NestJS 파일 구조

#### 1. main.ts

NestJs는 main.ts 를 가짐 이름바꾸면 안됨
NestJs는 main.ts 에서 시작함

#### 2. app.module.ts

앱 모듈은 모든 것의 루트 모듈
controllers : 기본적으로 url을 가져오고 함수를 실행하는것 
ex) 컨트롤러는 express의 라우터 같은것
providers: 비즈니스 로직을 처리


#### 3. app.controller.ts

```typescript
@Controller()
export class AppController[
  constructor(private readonly appService:appService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get("/hello")
  sayHello(): string {
    return "Hello everyone";
  }

}
```
@Get : 데코레이터 express의 get라우터와 같은 역할을 함
컨트롤러는 url로의 요청을 받음 여기서 url은 "/hello"
@Get 데코레이터 덕분에 NestJS 는 /hello 로 요청이 들어오면, sayHello 함수를 실행 해야 한다는 것을 알수 있음

💡 controller에서 굳이 service를 쓰는 이유가 뭘까?

1. NestJS 는 컨트롤러와 비즈니스 로직을 구분짓고 싶어한다.

2. 컨트롤러는 그냥 url을 가져오는 역할일 뿐이다. 그리고 함수를 실행하는 정도


#### 4.app.service.ts

app.service.ts

```typescript
import {Injectable} from "@nestjs/common"

@Injectable()
export class AppService {
  getHello():string {
    return "hello Nest";
  }
  sayHello():string{
    return "Hi nest"
  }
}
```

app.controller.ts

```typescript
@Controller()
export class AppController[
  constructor(private readonly appService:appService) {}

  @Get()
  getHello():string {
    return this.appService.getHello();
  }
  
  @Get("/hello")
  sayHello():string{
    return this.appService.sayHello();
  }
}
```


### Generate

NestJS 에서는 cli NestJS의 거의 모든 것을 생성 할 수 있음.

```bash
nest g co
```

와 저절로 src/movies 폴더 생성 그리고 app.module.ts 파일에 MoviesController가 자동 import 됨 Nice! 서비스도 마찬가지임


### DTO(데이터 전송 객체 - Data Transfer Object)

코드를 더 간결하게 만들 수 있다.
쿼리에 대해 유효성 검사를 할 수 있다.

```typescript 
//main.ts

import { ValidationPipe } from '@nestjs/common';
...

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```
pipe 는 미들웨어 같은것!
app.useClobalPipes


### ValidationPipes 의 속성 transform

```typescript
//controller 일부
@Get(':id')
  getOne(@Param('id') movieId: string): Movie {
    return this.moviesService.getOne(movieId);
  }

//service 일부
 getOne(id: string): Movie {
    const movie = this.movies.find((movie) => movie.id === +id);
    if (!movie) {
      throw new NotFoundException(`Moview with ID:${id} not found`);
    }
    return movie;
  }
```

url로 보낸 값은 뭐든지 일단 string 이다.
따라서 id를 number 타입으로 바꿔서 써야함. => +id 이렇게
우리 엔티티에서 id는 숫자여야한다.

```typescript
//main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
```

transform 은 url로 전송된 pramater(ex: id) 를 실제 우리가 원하는 타입으로 바꾸어 준다.

#### PartialType

data update 를 할 때 Movie의 전체가 아닌 일부분만 업데이트 할 수도 있다.
따라서 입력 값의 type은 이렇게 작성할 수 있다.

```typescript
import { IsString, IsNumber } from 'class-validator';
export class UpdateMovieDto {
  @IsString()
  readonly title?: string;

  @IsNumber()
  readonly year?: number;

  @IsString({ each: true })
  readonly genres?: string[];
}
```
하지만! NestJS의 PartialType을 쓰도록 한다

```bash
npm i @nestjs/mapped-types
```
타입을 변환시키고 사용할 수 있도록 하는 패키지

```typescript
//update-movie.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreatemovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreatemovieDto) {}
```
CreatemovieDto를 가져와서 쓸 수 있음 하지만 CreatemovieDto 처럼 모든 값이 필수가 아님.
