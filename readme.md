### 周报生成脚本

1.使用方式

```
npx weekly

Options:
  -V, --version             output the version number
  -u, --users [users...]    filter by usernames
  -p, --path <gitRepoPath>  git repository in local system path
  -d, --dist <destPath>     the directory output weekly excel
  -h, --help                display help for command
```

2.example

```
npx weekly -u caoxi caoxm -p . -d ./weekly
```
