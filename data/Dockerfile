# THTTPD is not maintained, do not use this image in production!

FROM alpine AS builder

ARG THTTPD_VERSION=2.29

# Deps for compiling thttpd
RUN apk add gcc musl-dev make

# Fetch thttpd sources
RUN wget http://www.acme.com/software/thttpd/thttpd-${THTTPD_VERSION}.tar.gz \
  && tar xzf thttpd-${THTTPD_VERSION}.tar.gz \
  && mv /thttpd-${THTTPD_VERSION} /thttpd

# Compile
RUN cd /thttpd \
  && ./configure \
  && make CCOPT='-O2 -s -static' thttpd

# Create non-root user
RUN adduser -D static

# ---

FROM scratch

# Copy user
COPY --from=builder /etc/passwd /etc/passwd
# Copy thttpd
COPY --from=builder /thttpd/thttpd /

USER static
WORKDIR /home/static
COPY . .
EXPOSE 3000
CMD ["/thttpd", "-D", "-h", "0.0.0.0", "-p", "3000", "-d", "/home/static", "-u", "static", "-l", "-", "-M", "60"]
