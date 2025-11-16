package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"time"
)

func GenerateSecret() []byte {
	secret := make([]byte, 20)
	_, err := rand.Read(secret)
	if err != nil {
		panic("Failed to generate random bytes")
	}
	return secret
}

func AlgoTOTP(secret []byte, counter int64) int {
	var buf [8]byte
	binary.BigEndian.PutUint64(buf[:], uint64(counter))

	h := hmac.New(sha1.New, secret)
	h.Write(buf[:])
	hash := h.Sum(nil)
	offset := hash[len(hash)-1] & 0x0F
	part := hash[offset : offset+4]

	number := binary.BigEndian.Uint32(part) & 0x7FFFFFFF

	return int(number % 1000000)
}

func main() {
	secret := GenerateSecret()
	encoded := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(secret)

	fmt.Println("Secret (base32):", encoded)

	for {
 		 current := time.Now().Unix()/30
 		 next := current + 1;
 		 prev := current - 1;
 		 fmt.Println(AlgoTOTP(secret, prev))
 		 fmt.Println(AlgoTOTP(secret, current))
 		 fmt.Println(AlgoTOTP(secret, next))
		 time.Sleep(30 * time.Second)
	}
}

