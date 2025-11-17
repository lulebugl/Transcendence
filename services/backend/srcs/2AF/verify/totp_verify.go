package verify


import (
    "database/sql"
    "fmt"
    _ "github.com/mattn/go-sqlite3"
)

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

func main()
{

}
