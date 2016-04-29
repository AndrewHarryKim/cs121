package ir.assignments.two.d;

import ir.assignments.two.a.Frequency;
import ir.assignments.two.a.Utilities;
import ir.assignments.two.b.WordFrequencyCounter;
import ir.assignments.two.c.TwoGramFrequencyCounter;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PalindromeFrequencyCounter {
	/**
	 * This class should not be instantiated.
	 */
	private PalindromeFrequencyCounter() {}
	
	/**
	 * Takes the input list of words and processes it, returning a list
	 * of {@link Frequency}s.
	 * 
	 * This method expects a list of lowercase alphanumeric strings.
	 * If the input list is null, an empty list is returned.
	 * 
	 * There is one frequency in the output list for every 
	 * unique palindrome found in the original list. The frequency of each palindrome
	 * is equal to the number of times that palindrome occurs in the original list.
	 * 
	 * Palindromes can span sequential words in the input list.
	 * 
	 * The returned list is ordered by decreasing size, with tied palindromes sorted
	 * by frequency and further tied palindromes sorted alphabetically. 
	 * 
	 * The original list is not modified.
	 * 
	 * Example:
	 * 
	 * Given the input list of strings 
	 * ["do", "geese", "see", "god", "abba", "bat", "tab"]
	 * 
	 * The output list of palindromes should be 
	 * ["do geese see god:1", "bat tab:1", "abba:1"]
	 *  
	 * @param words A list of words.
	 * @return A list of palindrome frequencies, ordered by decreasing frequency.
	 */
	private static List<Frequency> computePalindromeFrequencies(ArrayList<String> words) {
		// TODO Write body!
		// You will likely want to create helper methods / classes to help implement this functionality
		
		if (words == null || words.isEmpty()) 
			return new ArrayList<Frequency>(0);
//		List<String> palindromes=new ArrayList<String>();
//		int l=words.size();
//		String checked,longest;
//		outerloop:
//		for(int i=0;i<l;++i)// O(n)
//		{
//			ArrayList<String> temp=new ArrayList<String>(words);
//			while(!temp.isEmpty()){ //O(n)
//				
//				checked=combineList(temp); 
//				longest=findLongestPalindrome(checked);
//				if(longest.length()==0)
//				{
//					break outerloop;
//				}
//				if(longest.length()==checked.length())
//				{
//					
//					palindromes.add(longest);
//					break;
//				}
//				temp.remove(temp.size()-1);
//			}
//			words.remove(0);
//		}
//		
//	
//		List items=new ArrayList<String>();
//		for(int i=1;i<words.size();++i)
		List<String> items = findPalindromeItems(words,1);
		
		return WordFrequencyCounter.computeWordFrequencies(items);
	}
	public static String combineList(ArrayList<String> words)
	{
		String out="";
		for(String a:words)
			out+=a;
			
		return out;
		
	}
	//Based on the Manchester method (Source: Rosetta Code) O(String len)
	public static String findLongestPalindrome(String s) {
        if (s==null || s.length()==0)
            return "";
        
        char[] s2 = addBoundaries(s.toCharArray());
        
        int[] p = new int[s2.length]; 
        int c = 0, r = 0; // Here the first element in s2 has been processed.
        int m = 0, n = 0; // The walking indices to compare if two elements are the same
        for (int i = 1; i<s2.length; i++) {
        	
            if (i>r) {
                p[i] = 0; m = i-1; n = i+1;
            } else {
                int i2 = c*2-i;
                if (p[i2]<(r-i)) {
                    p[i] = p[i2];
                    m = -1; // This signals bypassing the while loop below. 
                } else {
                    p[i] = r-i;
                    n = r+1; m = i*2-n;
                }
            }
            while (m>=0 && n<s2.length && s2[m]==s2[n]) {
                p[i]++; m--; n++;
            }
            if ((i+p[i])>r) {
                c = i; r = i+p[i];
            }
        }
        int len = 0; c = 0;
        for (int i = 1; i<s2.length; i++) {
            if (len<p[i]) {
                len = p[i]; c = i;
            }
        }
        char[] ss = Arrays.copyOfRange(s2, c-len, c+len+1);
        return String.valueOf(removeBoundaries(ss));
    }
	 private static char[] addBoundaries(char[] cs) {
	        if (cs==null || cs.length==0)
	            return "||".toCharArray();

	        char[] cs2 = new char[cs.length*2+1];
	        for (int i = 0; i<(cs2.length-1); i = i+2) {
	            cs2[i] = '|';
	            cs2[i+1] = cs[i/2];
	        }
	        cs2[cs2.length-1] = '|';
	        return cs2;
	    }
	  private static char[] removeBoundaries(char[] cs) {
	        if (cs==null || cs.length<3)
	            return "".toCharArray();

	        char[] cs2 = new char[(cs.length-1)/2];
	        for (int i = 0; i<cs2.length; i++) {
	            cs2[i] = cs[i*2+1];
	        }
	        return cs2;
	  }    
	  public static List<String> findPalindromeItems(ArrayList<String> words,int n) {
			//To save computation
			if(words==null || words.size()<=n-1)
				return null;
			
			List<String> tmp = new ArrayList<String>(words.size() - (n-1));
			
			for (int i = n-1; i < words.size(); ++i) 
				tmp.addAll(getStringsToAdd(words,n,i));
			
			// Making an assumption that this class is available
			return tmp;
		}
		private static List<String> getStringsToAdd(ArrayList<String> words,int n,int i)
		{
			//i is the current location of traversal
			List<String> listOfOutput=new ArrayList<String>();
			String out=words.get(i-(n-1));
			
			String str=out.replaceAll("\\s","");
			StringBuilder sb = new StringBuilder(str);
			if(str.equals(sb.reverse().toString()))
			{
				
				listOfOutput.add(out);
				
			}
			for (int q = i-(n-2); q<=words.size()-n; ++q)
			{
				
				out= out+ " "+(words.get(q));
				str=out.replaceAll("\\s","");
				sb = new StringBuilder(str);
				if(str.equals(sb.reverse().toString()))
				{
					
					listOfOutput.add(out);
					
				}
			}
			
			
			//System.out.println(listOfOutput);
			return listOfOutput;
			
		}
	private static List<String> findAllOfThem(ArrayList<String> words)
	{
		return words;
		
	}
	/**
	 * Runs the 2-gram counter. The input should be the path to a text file.
	 * 
	 * @param args The first element should contain the path to a text file.
	 */
	public static void main(String[] args) {
		
		File file = new File(args[0]);
		//String file="do geese see god abba bat tab";
		ArrayList<String> words = Utilities.tokenizeFile(file);
		System.out.println("Running...");
		List<Frequency> frequencies = computePalindromeFrequencies(words);
		Utilities.printFrequencies(frequencies);
		System.out.println("Finished...");
		
	}
}
