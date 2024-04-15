FROM public.ecr.aws/lambda/nodejs:20

COPY . .

ENTRYPOINT ["/lambda-entrypoint.sh"]

CMD ["dist/index.handler"]
